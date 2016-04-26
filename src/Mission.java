/*
 * Copyright (C) 2011 by Øyvind Hanssen (ohanssen@acm.org)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */

package no.polaric.aprsdb;
import java.util.*;


public class Mission
{

  private String src;
  private String alias;
  private String icon;
  private Date start;
  private Date end;
  private String descr;



	/**
	* Default empty Mission constructor
	*/
	public Mission() {
		super();
	}

	/**
	* Default Mission constructor
	*/
	public Mission(String src, String alias, String icon, Date start, Date end, String descr) {
		super();
		this.src = src;
		this.alias = alias;
		this.icon = icon;
		this.start = start;
		this.end = end;
		this.descr = descr;

	}

	/**
	* Returns value of src
	* @return
	*/
	public String getSrc() {
		return src;
	}

	/**
	* Sets new value of src
	* @param
	*/
	public void setSrc(String src) {
		this.src = src;
	}

	/**
	* Returns value of alias
	* @return
	*/
	public String getAlias() {
		return alias;
	}

	/**
	* Sets new value of alias
	* @param
	*/
	public void setAlias(String alias) {
		this.alias = alias;
	}

	/**
	* Returns value of icon
	* @return
	*/
	public String getIcon() {
		return icon;
	}

	/**
	* Sets new value of icon
	* @param
	*/
	public void setIcon(String icon) {
		this.icon = icon;
	}

	/**
	* Returns value of start
	* @return
	*/
	public Date getStart() {
		return start;
	}

	/**
	* Sets new value of start
	* @param
	*/
	public void setStart(Date start) {
		this.start = start;
	}

	/**
	* Returns value of end
	* @return
	*/
	public Date getEnd() {
		return end;
	}

	/**
	* Sets new value of end
	* @param
	*/
	public void setEnd(Date end) {
		this.end = end;
	}

	/**
	* Returns value of descr
	* @return
	*/
	public String getDescr() {
		return descr;
	}

	/**
	* Sets new value of descr
	* @param
	*/
	public void setDescr(String descr) {
		this.descr = descr;
	}


}
